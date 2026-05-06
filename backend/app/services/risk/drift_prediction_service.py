import math
import logging
from datetime import datetime, timedelta
from app.core.config import settings

logger = logging.getLogger(__name__)

class DriftPredictionService:
    """
    Service to predict the drift and spread of an oil spill based on 
    wind and ocean current data.
    """

    def __init__(self):
        # In a real scenario, we'd use settings.openweathermap_api_key
        # For now, we'll simulate weather data if no key is present
        pass

    def predict_drift(self, start_lat: float, start_lon: float, hours: int = 24) -> list[dict]:
        """
        Predicts the path of the spill over the given number of hours.
        Returns a list of coordinates with timestamps.
        """
        # 1. Fetch current weather (simulated for now)
        # In reality: wind = self._get_weather(start_lat, start_lon)
        wind_speed_mps = 5.0  # 5 meters per second
        wind_direction_deg = 45.0  # From Northeast
        current_speed_mps = 0.5  # 0.5 meters per second ocean current
        current_direction_deg = 180.0  # Moving South

        path = []
        current_lat = start_lat
        current_lon = start_lon
        current_time = datetime.utcnow()

        # Initial point
        path.append({
            "latitude": current_lat,
            "longitude": current_lon,
            "timestamp": current_time.isoformat(),
            "type": "origin"
        })

        # Calculate drift vector
        # Oil drift rule of thumb: 100% of current + 3% of wind speed
        # Convert wind from "coming from" to "moving towards" (add 180)
        wind_towards_deg = (wind_direction_deg + 180) % 360
        
        # Components of wind drift (3% of wind speed)
        wind_drift_speed = wind_speed_mps * 0.03
        
        # Vector addition of wind and current
        # current vector
        c_x = current_speed_mps * math.sin(math.radians(current_direction_deg))
        c_y = current_speed_mps * math.cos(math.radians(current_direction_deg))
        
        # wind drift vector
        w_x = wind_drift_speed * math.sin(math.radians(wind_towards_deg))
        w_y = wind_drift_speed * math.cos(math.radians(wind_towards_deg))
        
        # Resulting drift vector (m/s)
        total_v_x = c_x + w_x
        total_v_y = c_y + w_y
        
        # Predict hour by hour
        for h in range(1, hours + 1):
            # Distance moved in one hour (3600 seconds)
            dist_x = total_v_x * 3600
            dist_y = total_v_y * 3600
            
            # Update lat/lon (approximate: 111,320 meters per degree)
            # This is a simple approximation valid for small distances
            delta_lat = dist_y / 111320.0
            delta_lon = dist_x / (111320.0 * math.cos(math.radians(current_lat)))
            
            current_lat += delta_lat
            current_lon += delta_lon
            current_time += timedelta(hours=1)
            
            path.append({
                "latitude": round(current_lat, 6),
                "longitude": round(current_lon, 6),
                "timestamp": current_time.isoformat(),
                "type": "prediction",
                "hour": h
            })

        return path

    def get_risk_zones_in_path(self, path: list[dict], risk_zones: list) -> list:
        """
        Check if the predicted path intersects with any known eco-sensitive zones.
        """
        threatened_zones = []
        for zone in risk_zones:
            for point in path:
                # Simple distance check (could be improved with polygon intersection)
                distance = self._calculate_distance(
                    point["latitude"], point["longitude"], 
                    zone.latitude, zone.longitude
                )
                if distance < zone.radius_km:
                    threatened_zones.append(zone)
                    break
        return threatened_zones

    def _calculate_distance(self, lat1, lon1, lat2, lon2):
        # Haversine formula
        R = 6371  # Earth radius in km
        d_lat = math.radians(lat2 - lat1)
        d_lon = math.radians(lon2 - lon1)
        a = (math.sin(d_lat / 2) ** 2 + 
             math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * 
             math.sin(d_lon / 2) ** 2)
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return R * c

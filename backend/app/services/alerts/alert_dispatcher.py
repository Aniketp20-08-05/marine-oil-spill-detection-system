def build_alert_message(vessel_data: dict, risk_result: dict) -> str:
    return (
        f"Potential marine oil spill risk detected near "
        f"({vessel_data['latitude']}, {vessel_data['longitude']}) for vessel "
        f"{vessel_data['name']} [{vessel_data['imo_number']}]. "
        f"Risk Level: {risk_result['risk_level']}"
    )
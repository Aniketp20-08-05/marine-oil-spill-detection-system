def get_realistic_name(imo: str, original: str) -> str:
    if original and not original.startswith("Vessel_"):
        return original
    names = [
        "Pioneer Spirit", "Ocean Explorer", "MSC Diana", "CMA CGM Marco Polo", "Seawise Giant",
        "Emma Maersk", "Valemax", "TI Class Supertanker", "Ever Given", "HMM Algeciras",
        "OOCL Hong Kong", "Madrid Maersk", "CSCL Globe", "CMA CGM Antoine",
        "Genoa Express", "Algeciras Express", "Berge Emperor", "Knock Nevis", "Batillus",
        "Bellamya", "Pierre Guillaumat", "Esso Atlantic", "Esso Pacific", "Sea World"
    ]
    try:
        index = int(imo) + 3
    except:
        index = 3
    return names[index % len(names)]

def get_realistic_type(imo: str, original: str) -> str:
    if original and original not in ["Unknown", "N/A"]:
        return original
    types = ["Oil Tanker", "Bulk Carrier", "Container Ship", "LNG Carrier", "Chemical Tanker"]
    try:
        index = int(imo)
    except:
        index = 0
    return types[index % len(types)]

def build_alert_message(vessel_data: dict, risk_result: dict) -> str:
    vessel_name = get_realistic_name(vessel_data['imo_number'], vessel_data.get('name', 'Unknown'))
    vessel_type = get_realistic_type(vessel_data['imo_number'], vessel_data.get('type', 'Unknown'))
    imo = vessel_data['imo_number']
    
    return (
        f"🚨 SPILL INCIDENT DETECTED | "
        f"Vessel: {vessel_name} | "
        f"IMO: {imo} | "
        f"Type: {vessel_type} | "
        f"Position: ({vessel_data['latitude']:.4f}, {vessel_data['longitude']:.4f}) | "
        f"Risk Level: {risk_result['risk_level']}"
    )
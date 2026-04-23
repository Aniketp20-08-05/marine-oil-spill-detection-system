def test_health_check(client):
    response = client.get("/health/")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_root_endpoint(client):
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()

def test_get_vessels_empty(client):
    response = client.get("/vessels/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

from app.services.system_pipeline import SystemPipeline

def test_pipeline_execution(db):
    pipeline = SystemPipeline(db)
    # This might take a while as it mocks the AIS stream or uses mock data
    result = pipeline.run_monitoring_pipeline()
    
    assert "total_vessels_processed" in result
    assert "results" in result
    assert result["total_vessels_processed"] >= 0
    
    if result["total_vessels_processed"] > 0:
        first_result = result["results"][0]
        assert "vessel" in first_result
        assert "status" in first_result

# Simple gRPC Client-Server Application with FastAPI

This project demonstrates a simple gRPC implementation with a FastAPI backend integration.

## Files Structure

- `greeting.proto` - Protocol Buffer definition
- `greeting_pb2.py` - Generated Python protobuf code
- `greeting_pb2_grpc.py` - Generated gRPC service code
- `grpc_server.py` - gRPC server implementation
- `fastapi_server.py` - FastAPI server that integrates with gRPC
- `grpc_client.py` - Simple gRPC client for testing
- `requirements.txt` - Python dependencies

## How to Run

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Start the gRPC Server
```bash
python grpc_server.py
```
The gRPC server will start on port 50051.

### 3. Start the FastAPI Server (in another terminal)
```bash
python fastapi_server.py
```
The FastAPI server will start on port 8000.

### 4. Test with gRPC Client
```bash
python grpc_client.py
```

### 5. Test with FastAPI Endpoints

Visit `http://localhost:8000/docs` for Swagger UI, or use curl:

```bash
# Single greeting
curl -X POST "http://localhost:8000/greet" \
     -H "Content-Type: application/json" \
     -d '{"name": "World"}'

# Stream greeting
curl -X POST "http://localhost:8000/greet-stream" \
     -H "Content-Type: application/json" \
     -d '{"name": "Stream User"}'
```

## Services

### GreetingService
- `SayHello`: Returns a single greeting message
- `SayHelloStream`: Returns a stream of 5 greeting messages with 1-second delays
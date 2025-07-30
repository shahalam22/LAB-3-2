import grpc
import asyncio
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import greeting_pb2
import greeting_pb2_grpc


app = FastAPI(title="gRPC FastAPI Integration", version="1.0.0")


class GreetingRequest(BaseModel):
    name: str


class GreetingResponse(BaseModel):
    message: str


def get_grpc_client():
    channel = grpc.insecure_channel('localhost:50051')
    return greeting_pb2_grpc.GreetingServiceStub(channel)


@app.get("/")
async def root():
    return {"message": "FastAPI gRPC Integration Server"}


@app.post("/greet", response_model=GreetingResponse)
async def greet(request: GreetingRequest):
    try:
        client = get_grpc_client()
        grpc_request = greeting_pb2.HelloRequest(name=request.name)
        response = client.SayHello(grpc_request)
        return GreetingResponse(message=response.message)
    except grpc.RpcError as e:
        raise HTTPException(status_code=500, detail=f"gRPC error: {e.details()}")


@app.post("/greet-stream", response_model=list[GreetingResponse])
async def greet_stream(request: GreetingRequest):
    try:
        client = get_grpc_client()
        grpc_request = greeting_pb2.HelloRequest(name=request.name)
        responses = []
        
        for response in client.SayHelloStream(grpc_request):
            responses.append(GreetingResponse(message=response.message))
        
        return responses
    except grpc.RpcError as e:
        raise HTTPException(status_code=500, detail=f"gRPC error: {e.details()}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
import grpc
import greeting_pb2
import greeting_pb2_grpc


def run_client():
    with grpc.insecure_channel('localhost:50051') as channel:
        stub = greeting_pb2_grpc.GreetingServiceStub(channel)
        
        print("=== Testing SayHello ===")
        request = greeting_pb2.HelloRequest(name="World")
        response = stub.SayHello(request)
        print(f"Response: {response.message}")
        
        print("\n=== Testing SayHelloStream ===")
        stream_request = greeting_pb2.HelloRequest(name="Stream User")
        responses = stub.SayHelloStream(stream_request)
        
        for response in responses:
            print(f"Stream Response: {response.message}")


if __name__ == '__main__':
    print("Starting gRPC client...")
    try:
        run_client()
    except grpc.RpcError as e:
        print(f"gRPC error: {e.details()}")
    except Exception as e:
        print(f"Error: {e}")
import grpc
import time
from concurrent import futures
import greeting_pb2
import greeting_pb2_grpc


class GreetingServicer(greeting_pb2_grpc.GreetingServiceServicer):
    def SayHello(self, request, context):
        message = f"Hello, {request.name}!"
        return greeting_pb2.HelloResponse(message=message)
    
    def SayHelloStream(self, request, context):
        for i in range(5):
            message = f"Hello #{i+1}, {request.name}!"
            yield greeting_pb2.HelloResponse(message=message)
            time.sleep(1)


def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    greeting_pb2_grpc.add_GreetingServiceServicer_to_server(GreetingServicer(), server)
    
    listen_addr = '[::]:50051'
    server.add_insecure_port(listen_addr)
    
    print(f"Starting gRPC server on {listen_addr}")
    server.start()
    
    try:
        server.wait_for_termination()
    except KeyboardInterrupt:
        print("\nShutting down gRPC server...")
        server.stop(0)


if __name__ == '__main__':
    serve()
import http.server, socketserver

PORT = 8000

Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Serving at port {PORT}")
    print("Open your browser and navigate to http://localhost:8000")
    httpd.serve_forever()

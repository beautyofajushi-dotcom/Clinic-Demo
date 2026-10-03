#!/usr/bin/env python3
"""Static server for the demo site that forbids caching,
so live previews always fetch the freshest HTML/CSS/JS."""
import http.server
import socketserver
import os

os.chdir(os.path.dirname(os.path.abspath(__file__)))

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

socketserver.ThreadingTCPServer.allow_reuse_address = True
with socketserver.ThreadingTCPServer(("0.0.0.0", 3000), NoCacheHandler) as httpd:
    print("Serving dental-clinic-demo on 0.0.0.0:3000 (no-store)")
    httpd.serve_forever()

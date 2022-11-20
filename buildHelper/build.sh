# build.sh
#!/bin/bash

# Build image and push to DockerHub
docker image build --tag t16h05008/dt-herne-wanne-backend . && \
docker push t16h05008/dt-herne-wanne-backend
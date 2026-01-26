#!/bin/bash
# Build and push script for Dropfast Docker image
# Usage: ./build.sh [staging|production] [push] [tag]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
BUILD_ENV=${1:-staging}
PUSH=${2:-false}
IMAGE_NAME=${IMAGE_NAME:-dropfast}
REGISTRY=${REGISTRY:-""}  # e.g., "docker.io/username/" or "ghcr.io/username/"
VERSION=${3:-latest}

# Validate build environment
if [[ ! "$BUILD_ENV" =~ ^(staging|production)$ ]]; then
    echo -e "${RED}Error: BUILD_ENV must be 'staging' or 'production'${NC}"
    exit 1
fi

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Building Dropfast Docker Image${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "Environment: ${YELLOW}${BUILD_ENV}${NC}"
echo -e "Image: ${YELLOW}${REGISTRY}${IMAGE_NAME}:${VERSION}${NC}"
echo -e "Push: ${YELLOW}${PUSH}${NC}"
echo ""

# Build arguments
BUILD_ARGS="--build-arg BUILD_ENV=${BUILD_ENV}"
BUILD_ARGS="${BUILD_ARGS} --platform linux/amd64,linux/arm64"  # Multi-platform support

# Full image name
FULL_IMAGE_NAME="${REGISTRY}${IMAGE_NAME}:${VERSION}"

# Build the image
echo -e "${GREEN}Building Docker image...${NC}"
docker buildx build \
    ${BUILD_ARGS} \
    -t "${FULL_IMAGE_NAME}" \
    -t "${REGISTRY}${IMAGE_NAME}:${BUILD_ENV}-latest" \
    --load \
    .

if [ $? -ne 0 ]; then
    echo -e "${RED}Build failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Build successful!${NC}"

# Show image size
echo ""
echo -e "${GREEN}Image size:${NC}"
docker images "${FULL_IMAGE_NAME}" --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"

# Push if requested
if [ "$PUSH" = "push" ] || [ "$PUSH" = "true" ]; then
    if [ -z "$REGISTRY" ]; then
        echo -e "${YELLOW}Warning: No registry specified. Skipping push.${NC}"
        echo -e "${YELLOW}Set REGISTRY environment variable to push (e.g., export REGISTRY='docker.io/username/')${NC}"
    else
        echo ""
        echo -e "${GREEN}Pushing image to registry...${NC}"
        docker push "${FULL_IMAGE_NAME}"
        docker push "${REGISTRY}${IMAGE_NAME}:${BUILD_ENV}-latest"
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓ Push successful!${NC}"
        else
            echo -e "${RED}Push failed!${NC}"
            exit 1
        fi
    fi
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Build complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "To run the container:"
echo -e "  ${YELLOW}docker run -p 3000:3000 ${FULL_IMAGE_NAME}${NC}"
echo ""

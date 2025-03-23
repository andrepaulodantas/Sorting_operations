#!/bin/bash

# Display usage information
display_usage() {
    echo "Product UI Application"
    echo ""
    echo "Usage:"
    echo "  ./run.sh [option]"
    echo ""
    echo "Options:"
    echo "  install      Install dependencies"
    echo "  dev          Start development server"
    echo "  build        Build for production"
    echo "  preview      Preview production build"
    echo "  lint         Run linter"
    echo "  help         Display this help message"
    echo ""
    echo "Example:"
    echo "  ./run.sh install    # Install dependencies"
    echo "  ./run.sh dev        # Start development server"
}

# Check if no arguments were provided
if [ $# -eq 0 ]; then
    display_usage
    exit 1
fi

# Process the provided argument
case "$1" in
    install)
        echo "Installing dependencies..."
        npm install
        ;;
    dev)
        echo "Starting development server..."
        npm run dev
        ;;
    build)
        echo "Building for production..."
        npm run build
        ;;
    preview)
        echo "Previewing production build..."
        npm run preview
        ;;
    lint)
        echo "Running linter..."
        npm run lint
        ;;
    help)
        display_usage
        ;;
    *)
        echo "Invalid option: $1"
        display_usage
        exit 1
        ;;
esac

exit 0 
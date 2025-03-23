#!/bin/bash

# Display usage information
display_usage() {
    echo "Product API Application"
    echo ""
    echo "Usage:"
    echo "  ./run.sh [option]"
    echo ""
    echo "Options:"
    echo "  build        Build the application"
    echo "  run          Run the application"
    echo "  test         Run the tests"
    echo "  clean        Clean the project"
    echo "  help         Display this help message"
    echo ""
    echo "Example:"
    echo "  ./run.sh build    # Build the application"
    echo "  ./run.sh run      # Run the application"
}

# Check if no arguments were provided
if [ $# -eq 0 ]; then
    display_usage
    exit 1
fi

# Process the provided argument
case "$1" in
    build)
        echo "Building the application..."
        mvn clean install
        ;;
    run)
        echo "Running the application..."
        mvn spring-boot:run
        ;;
    test)
        echo "Running tests..."
        mvn test
        ;;
    clean)
        echo "Cleaning the project..."
        mvn clean
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
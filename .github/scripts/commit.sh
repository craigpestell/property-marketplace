#!/bin/bash

# Helper script for creating conventional commits
# Usage: ./commit.sh <type> <scope> <message>
# Example: ./commit.sh feat ui "Add new button component"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Check if jq is installed (used to parse JSON config)
if ! command -v jq &> /dev/null; then
    echo -e "${YELLOW}Warning: jq is not installed. Using default commit format.${NC}"
fi

# Get available types and scopes from config if possible
CONFIG_FILE="./.github/copilot/commit-conventions.json"
TYPES=("feat" "fix" "docs" "style" "refactor" "perf" "test" "build" "ci" "chore" "revert")
SCOPES=("ui" "api" "db" "auth" "listings" "offers" "users" "notifications" "config" "docs" "theme")

if [ -f "$CONFIG_FILE" ] && command -v jq &> /dev/null; then
    TYPES=($(jq -r '.conventionalCommits.types[].type' "$CONFIG_FILE"))
    SCOPES=($(jq -r '.conventionalCommits.scopes[]' "$CONFIG_FILE"))
    MAX_SUBJECT_LENGTH=$(jq -r '.conventionalCommits.maxSubjectLength' "$CONFIG_FILE")
else
    MAX_SUBJECT_LENGTH=50
fi

display_help() {
    echo -e "${GREEN}Conventional Commit Helper${NC}"
    echo -e "Usage: ./commit.sh <type> <scope> <message> [<body>]"
    echo -e "Example: ./commit.sh feat ui \"Add new button component\" \"This adds a reusable button with variants\""
    echo
    echo -e "${GREEN}Available types:${NC}"
    for type in "${TYPES[@]}"; do
        echo "  - $type"
    done
    echo
    echo -e "${GREEN}Available scopes:${NC}"
    for scope in "${SCOPES[@]}"; do
        echo "  - $scope"
    done
    exit 1
}

# Display help if requested or not enough arguments
if [ "$1" == "--help" ] || [ "$1" == "-h" ] || [ $# -lt 3 ]; then
    display_help
fi

TYPE=$1
SCOPE=$2
MESSAGE=$3
BODY=$4

# Validate type
if [[ ! " ${TYPES[*]} " =~ " ${TYPE} " ]]; then
    echo -e "${RED}Error: Invalid type '$TYPE'.${NC}"
    echo -e "Valid types are: ${TYPES[*]}"
    exit 1
fi

# Validate scope
if [[ ! " ${SCOPES[*]} " =~ " ${SCOPE} " ]]; then
    echo -e "${YELLOW}Warning: Scope '$SCOPE' is not in the predefined list.${NC}"
    echo -e "Common scopes are: ${SCOPES[*]}"
    read -p "Continue with this scope? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check message length
if [ ${#MESSAGE} -gt $MAX_SUBJECT_LENGTH ]; then
    echo -e "${YELLOW}Warning: Commit message exceeds recommended length of $MAX_SUBJECT_LENGTH characters.${NC}"
    echo -e "Message length: ${#MESSAGE} characters"
    read -p "Continue with this message? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Construct the commit message
COMMIT_MESSAGE="${TYPE}(${SCOPE}): ${MESSAGE}"

# Show the final message
echo -e "${GREEN}Commit message:${NC}"
echo -e "$COMMIT_MESSAGE"

if [ ! -z "$BODY" ]; then
    echo -e "\n$BODY"
fi

# Confirm before committing
read -p "Create this commit? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

# Create the commit
if [ -z "$BODY" ]; then
    git commit -m "$COMMIT_MESSAGE"
else
    git commit -m "$COMMIT_MESSAGE" -m "$BODY"
fi

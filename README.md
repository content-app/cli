# Contentful Content Types CLI

This CLI allows a user to load Content Types from Contentful.

## Installation

To install the CLI, follow these steps:

`npm install @content-app/cli -g`

## Usage

### load-content-types

The CLI is started with the `load-content-types` command. The following options must be specified:

- `-a, --accessToken <accessToken>`: The access token for the Contentful account
- `-s, --spaceId <spaceId>`: The Space ID of the Contentful account

An environment can also be optionally specified with `-e, --environment <environment>`.

To use the CLI, the user must run the script file and specify the required options. If no options are specified, the CLI outputs a help message.

 *Example*

`content-app load-content-types -a <accessToken> -s <spaceId> -e <environment>`

This loads the Content Types with the specified access token and Space ID and optional environment.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

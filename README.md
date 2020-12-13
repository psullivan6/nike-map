# psullivan6 | Nike Run Club Data Visualizer

An app to visualize all my runs on the same map.

## Setup / Installation

### Quickstart

1. `./scripts/nike_activities.bash [BEARER_TOKEN]`
2. `yarn parse`
3. `yarn serve`

### Tech Stack + Requirements

Node 13+

### Build

#### Running Locally

1. Login to your [Nike Member Profile](https://www.nike.com/member/profile/)
2. Find an `api.nike.com` XHR request and copy the authorization `Bearer` token
3. Run the `./scripts/nike_activities.bash [BEARER_TOKEN]`, passing in the token as an argument
4. Ensure the Google Maps API is open to requests and isn't restricted based on HTTP referrer
5. Parse the downloaded JSON into a readable `.js` file: `yarn parse`
6. Run the site `yarn serve`

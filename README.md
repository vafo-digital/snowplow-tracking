# SNOWPLOW

Example installation and configuration of Snowplow with example event tracking.

## Getting Started

1. Install Docker.
2. Snowplow Micro will need to be setup through Docker https://docs.snowplow.io/docs/data-product-studio/data-quality/snowplow-micro/basic-usage/
3. Setup the Snowplow browser extension https://docs.snowplow.io/docs/data-product-studio/data-quality/snowplow-inspector/

### Installation

1.  Install NPM packages
   ```sh
   npm install
   ```

2. Run the project
   ```sh
   npm run dev
   ```

3. Update the collection URL in app.js, this is set to http://localhost:9090/ this is the port Snowplow Miro is running on.
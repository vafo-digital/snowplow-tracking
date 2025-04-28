# SNOWPLOW

Example installation and configuration of Snowplow with example event tracking.

### Installation

1.  Install NPM packages
   ```sh
   npm install
   ```

### Usage

1. Run the pipeline
   ```sh
   ./pipeline
   ```

2. Pipeline URL; http://localhost:9090/micro/ui 

3. Run the PHP Server
   ```sh
   php -S 0.0.0.0:8080
   ```

4. Run the project
   ```sh
   npm run dev
   ```

5. Project URL; http://localhost:1234/

6. There is also a browser extension you can install to view the Snowplow events; https://docs.snowplow.io/docs/data-product-studio/data-quality/snowplow-inspector/

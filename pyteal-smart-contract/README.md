# Setup

1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop)
2. Install [Algorand sandbox](https://github.com/algorand/sandbox)
3. Add this project folder as bind volume in sandbox `docker-compose.yml` under key `services.algod`:
    ```yml
    volumes:
      - type: bind
        source: <path>
        target: /data
    ```
4. Start sandbox:
    ```txt
    $ ./sandbox up
    ```
5. Install required :
    ```txt
    $ conda activate environmentName 
    $ pip3 install -r ./requirements.txt (to install packages)
    $ chmod +x build.sh  (to get the chmod permission to run build.sh file)
    ```
6. Compile code : 
    ```txt
    sudo ./build.sh contracts.counter.contractName (example sudo ./build.sh contracts.counter.counter)
    ```
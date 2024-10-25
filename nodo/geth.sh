docker run --rm -v "$(pwd)/pwd.txt:/p.txt" -v "$(pwd)/datos:/data" -p 5556:8545 ethereum/client-go:v1.13.15 --datadir /data --unlock 0xaeac2c69af70c58a0e8adb9bd1a1056728835fac --allow-insecure-unlock --mine --miner.etherbase 0xaeac2c69af70c58a0e8adb9bd1a1056728835fac --password /p.txt --nodiscover --http --http.addr "0.0.0.0" --http.api "admin,eth,debug,miner,net,txpool,personal,web3" --http.corsdomain "*"
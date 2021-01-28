questo è un gioco di tris con server


# server

## installazione

crea un virtual env e installa le dipendenze
 	
	cd server
	python3 -m venv .venv
	source .venv/bin/activate
	pip install -r requirements.txt


per eseguire il server:

	cd server
	source .venv/bin/activate
	uvicorn api_server:app --reload


per eseguire l'interfaccia grafica del server:
	
	cd tris-client
	npm start
	

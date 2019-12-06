
all:
	@echo all: Do nothing


# for local development

procname=hangout-bot

start:
	@pm2 start

restart:
	@pm2 restart ${procname}

recreate:
	@pm2 delete ${procname}
	@pm2 start

delete:
	@pm2 delete ${procname}


# for build & run

imagename=hangout-bot
containername=${imagename}-$(shell date +%s)

build: build-image

build-image:
	@docker build . -t ${imagename}

run: run-container

run-container:
	@docker run -it  --rm \
		--name ${containername} \
		-v ~/.config/gcloud/application_default_credentials.json:/credentials.json:ro \
		-e GOOGLE_APPLICATION_CREDENTIALS=/credentials.json \
		-e DEBUG=* \
		${imagename}

-include local.mk

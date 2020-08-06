#!/bin/sh
createdb filescloud
psql -U ppri -d filescloud -a -f init.sql

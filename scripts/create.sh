#!/bin/bash

rm -rf packages/$1
cp -r template packages
mv packages/template "packages/$1"
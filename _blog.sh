#!/bin/bash

DIR=~/Documents/projects/blog
P_DIR="$DIR/posts"
CATS=("articles" "notes")

create() {
	local cat="$1"
	local title="$2"
	local slug=$(echo "$title" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')
	local fn="$P_DIR/$cat/$slug.md"
	if [ -f "$fn" ]; then
		echo "File '$fn' already exists!"
		return
	else
		echo $fn
		echo "---" > $fn
		echo "title: " >> $fn
		echo "date: $(date '+%Y-%m-%d')" >> $fn
		echo "---" >> $fn
		echo "" >> $fn
		typora $fn
	fi
}

push() {
	local pwd = $(pwd)
	cd $DIR
	git add .
	git commit -m "$1"
	git push
	cd $pwd
}

case "$1" in
	new)
		create "$2" "$3"
		;;
	push)
		push $2
		;;

esac

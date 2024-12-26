#!/bin/bash

DIR=~/Documents/projects/blog
P_DIR="$DIR/posts"

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

edit() {
	typora "$1"
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
	edit)
		edit "$2"
		;;
	push)
		push "$2"
		;;
	help)
		echo "Commands:"
		echo "	new [category] [title]			Create a new post."
		echo "	edit <ctrl>t"				Edit an existing file. Use with FZF.
		echo "	push [message]				Create a git commit and push."
		echo "	help					This page."
		;;
	*)
		echo "Run *_blog help* for help."
		;;

esac

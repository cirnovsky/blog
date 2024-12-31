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
		read -p "1. vscode; 2. typora: " choice
		case $choice in
			1)
				code "$fn"
				;;
			2)
				typora "$fn"
				;;
			*)
				echo "Invalid."
				exit 1
				;;
		esac
	fi
}

edit() {
	read -p "1. vscode; 2. typora: " choice
	case $choice in
		1)
			code "$1"
			;;
		2)
			typora "$1"
			;;
		*)
			echo "Invalid."
			exit 1
			;;
	esac
}

run() {
	local pwd=$(pwd);
	cd $DIR
	npm run dev
	cd $pwd
}

build() {
	local pwd=$(pwd);
	cd $DIR
	npm run build
	cd $pwd
}

push() {
	local pwd=$(pwd)
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
	run)
		run
		;;
	build)
		build
		;;
	push)
		push "$2"
		;;
	help)
		echo "Commands:"
		echo "	new [category] [title]			Create a new post. Then choose your preferred editor."
		echo "	edit <ctrl>t				Edit an existing file. Use with FZF. Then choose your preferred editor."
		echo "	run					Run *npm run dev*."
		echo "	build					Run *npm run build*."
		echo "	push [message]				Create a git commit and push."
		echo "	help					This page."
		;;
	*)
		echo "Run *_blog help* for help."
		;;

esac

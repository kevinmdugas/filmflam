#!/bin/bash

input_file="title.basics.tsv"
output_file="title_stripped.tsv"

while IFS=$'\t' read -r tconst titleType primaryTitle originalTitle isAdult startYear endYear runtimeMinutes genres
do
  if [[ $titleType == "titleType" || $titleType == "movie" || $titleType == "tvSeries" ]]; then
    echo -e "$tconst\t$titleType\t$primaryTitle" >> "$output_file"
  fi
done < "$input_file"


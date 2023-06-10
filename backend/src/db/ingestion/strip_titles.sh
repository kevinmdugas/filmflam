#!/bin/bash

input_file="title.basics.tsv"
output_file="title_stripped.tsv"

while IFS=$'\t' read -r tconst titleType primaryTitle originalTitle isAdult startYear endYear runtimeMinutes genres
do
  if [[ ($titleType == "titleType" || $titleType == "movie" || $titleType == "tvSeries") && $startYear > 1990 ]]; then
    echo -e "$tconst\t$titleType\t$primaryTitle\t$startYear\t$genres" >> "$output_file"
  fi
done < "$input_file"


const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const inputFile = path.join(__dirname, "data", "tmdb_5000_movies.csv");
const outputFile = path.join(__dirname, "data", "movies.json");

const results = [];

fs.createReadStream(inputFile)
  .pipe(csv())
  .on("data", (row) => {
    try {
      const genresArray = JSON.parse(row.genres).map((g) => g.name);
      const releaseYear = row.release_date
        ? parseInt(row.release_date.split("-")[0])
        : null;

      results.push({
        id: parseInt(row.id),
        title: row.title,
        genres: genresArray,
        release_year: releaseYear,
        overview: row.overview,
        popularity: parseFloat(row.popularity),
        vote_average: parseFloat(row.vote_average),
        vote_count: parseInt(row.vote_count),
        budget: parseInt(row.budget),
        revenue: parseInt(row.revenue),
      });
    } catch (err) {
      console.error("Skipping row due to parse error:", err);
    }
  })
  .on("end", () => {
    const sample = results.slice(0, 100);

    fs.writeFileSync(outputFile, JSON.stringify(sample, null, 2));
    console.log(
      `✅ Converted ${sample.length} movies and saved to data/movies.json`
    );
  });

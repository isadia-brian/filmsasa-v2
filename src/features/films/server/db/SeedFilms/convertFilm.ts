import { db } from "@/db";
import { films } from "@/db/schema";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.TMDB_AUTH_KEY}`,
  },
};

const getFilmMovies = async (contentType: string) => {
  let allData = [];
  let baseUrl: string = "";
  if (contentType == "kids") {
    baseUrl = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&region=US&sort_by=popularity.desc&with_genres=16%2C10751&with_original_language=en&without_genres=10749%2C27%2C36%2C80%2C99%2C36%2C53%2C37&api_key=${process.env.TMDB_API_KEY}&page=`;
  } else if (contentType == "movie") {
    baseUrl = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&region=US&sort_by=popularity.desc&with_original_language=en&api_key=${process.env.TMDB_API_KEY}&page=`;
  }
  const urls = Array.from({ length: 30 }, (_, i) => `${baseUrl}${i + 1}`);
  try {
    for (let i = 0; i < urls.length; i++) {
      try {
        console.log(`Fetching page ${i + 1}/${urls.length}...`);
        const response = await fetch(urls[i], options);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();

        if (data.results) {
          const films = data.results.map(({ id }: { id: number }) => ({ id }));
          allData.push(...films);
        }

        // Add timeout except after last page
        if (i < urls.length - 1) {
          console.log(`Waiting 1 seconds before page ${i + 2}...`);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      } catch (error: any) {
        console.error(`Error on page ${i + 1}:`, error.message);
        // Optional: Add retry logic here if needed
      }
    }
    console.log(`Successfully fetched ${allData.length} ${contentType} films`);
    return allData;
  } catch (error) {
    console.error("Global error:", error);
    return [];
  }
};
export const convertFilmMovies = async (contentType: string) => {
  try {
    const data = await getFilmMovies(contentType);
    const dbFilms = await db.select().from(films);
    const tmdbIds = new Set(dbFilms.map((item) => item.tmdbId));
    const filteredData = data.filter((item) => !tmdbIds.has(item.id));
    const tmdbBaseUrl = "https://api.themoviedb.org/3/movie";
    if (!filteredData) return null;
    const processedMovies = [];

    for (let i = 0; i < filteredData.length; i++) {
      const movie = filteredData[i];
      let movieData = null;

      try {
        // Fetch movie details
        const response = await fetch(
          `${tmdbBaseUrl}/${movie.id}?append_to_response=images`,
          options,
        );
        if (!response.ok)
          throw new Error(`HTTP ${response.status} - ${response.statusText}`);

        // Process data
        const tmdbMovie = await response.json();
        const year = tmdbMovie.release_date?.split("-")[0] || null;

        movieData = {
          title: tmdbMovie.title,
          tmdbId: tmdbMovie.id,
          overview: tmdbMovie.overview,
          contentType,
          posterImage: tmdbMovie.poster_path ?? "",
          backdropImage: tmdbMovie.backdrop_path ?? "",
          quality: "HD",
          seasons: null,
          genres: tmdbMovie.genres.map((g: { name: string }) => g.name),
          year: year ? parseInt(year, 10) : null,
          runtime: tmdbMovie.runtime,
          rating: Math.round(tmdbMovie.vote_average),
        };
      } catch (error: any) {
        console.warn(`Error processing movie ID ${movie.id}:`, error.message);
        movieData = null;
        return null;
      }

      processedMovies.push(movieData);

      // Add 5-second timeout except after last item
      if (i < data.length - 1) {
        console.log(`Processed ${i + 1}/${data.length}. Waiting 1 second...`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    const validProcessedMovies = processedMovies.filter(
      (movie) => movie !== null,
    );
    console.log(
      `Completed processing. Successful: ${validProcessedMovies.length}/${data.length}`,
    );
    return validProcessedMovies;
  } catch (error) {
    console.error("Film conversion failed:", error);
    return [];
  }
};

const getSeries = async () => {
  let allData = [];
  const baseUrl = `https://api.themoviedb.org/3/discover/tv?include_adult=false&include_video=false&language=en-US&region=US&sort_by=popularity.desc&with_original_language=en&api_key=${process.env.TMDB_API_KEY}&page=`;

  const urls = Array.from({ length: 30 }, (_, i) => `${baseUrl}${i + 1}`);
  try {
    for (let i = 0; i < urls.length; i++) {
      try {
        console.log(`Fetching page ${i + 1}/${urls.length}...`);
        const response = await fetch(urls[i], options);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();

        if (data.results) {
          const films = data.results.map(({ id }: { id: number }) => ({ id }));
          allData.push(...films);
        }

        // Add timeout except after last page
        if (i < urls.length - 1) {
          console.log(`Waiting 1 seconds before page ${i + 2}...`);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      } catch (error: any) {
        console.error(`Error on page ${i + 1}:`, error.message);
        // Optional: Add retry logic here if needed
      }
    }
    console.log(`Successfully fetched ${allData.length} series films`);
    return allData;
  } catch (error) {
    console.error("Global error:", error);
    return [];
  }
};

export const convertSeries = async () => {
  try {
    const data = await getSeries();
    const dbFilms = await db.select().from(films);
    const tmdbIds = new Set(dbFilms.map((item) => item.tmdbId));
    const filteredData = data.filter((item) => !tmdbIds.has(item.id));
    const tmdbBaseUrl = "https://api.themoviedb.org/3/tv";
    if (!filteredData) return null;
    const processedSeries = [];

    for (let i = 0; i < filteredData.length; i++) {
      const tv = filteredData[i];
      let tvData = null;

      try {
        // Fetch movie details
        const response = await fetch(
          `${tmdbBaseUrl}/${tv.id}?append_to_response=images`,
          options,
        );
        if (!response.ok)
          throw new Error(`HTTP ${response.status} - ${response.statusText}`);

        // Process data
        const tmdbSeries = await response.json();
        const year = tmdbSeries.first_air_date?.split("-")[0] || null;

        const seasons = await getTVSeasons(tmdbSeries.id);

        tvData = {
          title: tmdbSeries.name,
          tmdbId: tmdbSeries.id,
          overview: tmdbSeries.overview,
          contentType: "tv",
          posterImage: tmdbSeries.poster_path ?? "",
          backdropImage: tmdbSeries.backdrop_path ?? "",
          runtime: null,
          genres: tmdbSeries.genres.map((g: { name: string }) => g.name),
          year: year ? parseInt(year, 10) : null,
          seasons,
          rating: Math.round(tmdbSeries.vote_average),
        };
      } catch (error: any) {
        console.warn(`Error processing film ID ${tv.id}:`, error.message);
        tvData = null;
        return null;
      }

      processedSeries.push(tvData);

      // Add 5-second timeout except after last item
      if (i < data.length - 1) {
        console.log(`Processed ${i + 1}/${data.length}. Waiting 1 seconds...`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    const validProcessedSeries = processedSeries.filter(
      (serie) => serie !== null,
    );
    console.log(
      `Completed processing. Successful: ${validProcessedSeries.length}/${data.length}`,
    );
    return validProcessedSeries;
  } catch (error) {
    console.error("Film conversion failed:", error);
    return [];
  }
};

const getTVSeasons = async (tmdbId: number) => {
  const url = `https://api.themoviedb.org/3/tv/${tmdbId}?api_key=${process.env.TMDB_API_KEY}`;
  const response = await fetch(url).then((res) => res.json());

  const noOfSeasons = response.number_of_seasons;
  return noOfSeasons;
};

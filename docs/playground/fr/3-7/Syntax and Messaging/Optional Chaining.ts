//// {  "compiler": {},  "order": 1}

// Le chaînage optionnel a atteint l'étape 3 du TC39 pendant le development
// de la version 3.7. Le chaînage optionnel permet d'écrire du code qui va
// interrompre l'execution des expressions dès qu'il atteint une valeur
// null ou undefined.

// Accès aux propriétés d'un objet

// Imaginons que nous ayons un album où l'artiste, et sa bio, puissent ne pas
// être present dans les données. Par exemple, une compilation pourrait ne pas
// avoir qu'un seul artiste.

type AlbumAPIResponse = {
  title: string;
  artist?: {
    name: string;
    bio?: string;
    previousAlbums?: string[];
  };
};

declare const album: AlbumAPIResponse;

// Avec le chaînage optionnel,
// vous pouvez écrire le code suivant:

const artistBio = album?.artist?.bio;

// A la place de:

const maybeArtistBio = album.artist && album.artist.bio;

// Dans ce cas ?. agit différemment que le ET logique (&&) car ce dernier traite
// les valeur fausses (e.g. une chaîne de caractères vide, 0, Nan et false) de
// façon différente.

// Le chaînage optionnel va seulement arrêter l'évaluation et retourner undefined
// si la valeur est null ou undefined.

// Accès à un élément optionnel

// Acceder à une propriété se fait avec l'opérateur ., et le chaînage optionnel
// marche aussi avec l'opérateur [] pour acceder à des éléments.

const maybeArtistBioElement = album?.["artist"]?.["bio"];

const maybeFirstPreviousAlbum = album?.artist?.previousAlbums?.[0];

// Appel optionnel

// Quand il s'agit d'appeler des fonctions qui peuvent être définies ou non définies,
// le chaînage optionnel permet d'appeler la fonction uniquement si elle existe.
// Cela peut remplacer le code où l'on écrirait traditionnellement quelque chose comme:
// if (func) func()

// Par example le chaînage optionnel pour appeler un callback après une requête
// vers une API:

const callUpdateMetadata = (metadata: any) => Promise.resolve(metadata); // Fake API call

const updateAlbumMetadata = async (metadata: any, callback?: () => void) => {
  await callUpdateMetadata(metadata);

  callback?.();
};

// Plus de détails sur le chaînage optionnel dans la version 3.7 sur le blog:
//
// https://devblogs.microsoft.com/typescript/announcing-typescript-3-7/

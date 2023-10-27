function generujEventy(pracownik) {
  const { WymiarOd, WymiarDo, Od_godz, Do_godz } = pracownik;
  if (!WymiarOd || !WymiarDo || !Od_godz || !Do_godz) {
    console.error("Brakujące dane w obiekcie pracownik:", pracownik);
    throw new Error("Brakujące dane w obiekcie pracownik.");
  }

  const startPlanowany = zmienStringNaTimestamp(pracownik.Data, WymiarOd);
  const koniecPlanowany = zmienStringNaTimestamp(pracownik.Data, WymiarDo);

  let eventy = [];

  if (Od_godz === "Urlop") {
    generujEvent(
      eventy,
      pracownik,
      startPlanowany,
      koniecPlanowany,
      "red",
      "(Urlop)"
    );
    for (let event of eventy) {
      event.start = timestampToReadableFormat(event.start);
      event.end = timestampToReadableFormat(event.end);
    }
    return eventy;
  }

  const startRzeczywisty = zmienStringNaTimestamp(pracownik.Data, Od_godz);
  const koniecRzeczywisty = zmienStringNaTimestamp(pracownik.Data, Do_godz);
  const czasRzeczywisty = koniecRzeczywisty - startRzeczywisty;
  const osmiogodzin = 8 * 60 * 60 * 1000;

  if (czasRzeczywisty >= osmiogodzin) {
    generujEvent(
      eventy,
      pracownik,
      startRzeczywisty,
      koniecRzeczywisty,
      "green"
    );
  } else if (czasRzeczywisty === 0) {
    generujEvent(eventy, pracownik, startPlanowany, koniecPlanowany, "red");
  } else {
    if (startRzeczywisty > startPlanowany) {
      generujEvent(eventy, pracownik, startPlanowany, startRzeczywisty, "red");
    }

    generujEvent(
      eventy,
      pracownik,
      startRzeczywisty,
      koniecRzeczywisty,
      "green"
    );
    if (koniecRzeczywisty < koniecPlanowany) {
      generujEvent(
        eventy,
        pracownik,
        koniecRzeczywisty,
        koniecPlanowany,
        "red"
      );
    }
  }

  for (let event of eventy) {
    event.start = timestampToReadableFormat(event.start);
    event.end = timestampToReadableFormat(event.end);
  }

  return eventy;
}

function zmienStringNaTimestamp(dataISO, godzina) {
  const [rok, miesiac, dzien] = dataISO.slice(0, 10).split("-").map(Number);
  const [godz, min] = godzina.split(":").map(Number);
  const timestamp = Date.UTC(rok, miesiac - 1, dzien, godz, min, 0, 0); // miesiące w JS są od 0 do 11
  return new Date(timestamp);
}

function timestampToReadableFormat(dateObj) {
  return dateObj.toISOString().slice(0, 16).replace("T", " ");
}

function generujEvent(tablica, pracownik, start, koniec, kolor, komunikat) {
  if (komunikat === undefined) {
    komunikat = "";
  } else {
    komunikat = komunikat + " ";
  }

  tablica.push({
    title: komunikat + pracownik.Imie + " " + pracownik.Nazwisko,
    start: start,
    end: koniec,
    color: kolor,
  });
}

export default generujEventy;

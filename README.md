# Albin_tenta3
NodeJs/Prisma/MySQL Tenta

1. Kan du förklara skillnaden mellan synkron och asynkron kod i Node.js?
I en synkron programmeringsmodell kör varje kod efter varandra efter den förakoden ör avslutad. Det gör så att man kan lätt få en ide överhur koden fungerar genom att bara läsa koden.
I en asynkron programmeringsmodell, vilken också benämnas Asynchronous I/O, så kör koden beroende på en central event loop som styr. Så for en någon kod block I/O så lämnas exekveringskontrollen över till event loopen.
  Några exempel kan vara när användaren mata in något från tangentbordet, eller om koden läser och skriver till filer.


3. Beskriv användningen av middleware i Express och ge exempel på några vanliga middleware.
Middleware-funktioner är funktioner som har åtkomst till request object (req), response object (res) och nästa funktion i programmets request-response cycle och hjälper till med att organisera och strukturera hanteringen av förfrågningar och svar i Express-applikationer.


5. Vilka fördelar erbjuder Prisma när det gäller att interagera med databasen?
Prisma erbjuder Migrations, Active Maintenance och Support for DB of your choice.

6. Hur definierar du en modell för en tabell i Prisma?
model User {
  id      Int      @id @default(autoincrement())
  username   String   @unique
  password    String?
  admin Boolean @default(false)
}
Först väljer du namnet på modelen med model nameOfYouChoice i exemplet är det user.
Sen så behöver du välja vad som ska vara i modelen vilket du gör genom att skriva in det i en {}.
Efter det är det vilka olika data du vill ha med och vad det ska vara för data typer och andra argument de ska följa.
   Exemple vis så är id int(nummer), och så är dens default autoicrement vilket betyder att om du inte skriver in vad den ska vara så kommer den att öka när du skapar något med modelen.
   Ett annat Exemple är att username uniquie vilket betyder att det inte kan finns mer än en med samma username.

8. Vad är skillnaden mellan npm install och npm install --save?
Npm install så installerar man till hela enheten och alla mappar, medans om man skriver npm install --save så installerar man just till en specifik mapp.

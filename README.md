# Currency Exchange API

> A robust RESTful API for real‑time currency conversion, historical rate lookups, and exchange rate management.  
> Built with **[ASP.NET Core 8 / Node.js / Python]** following clean architecture principles.

---

## Overview

This API integrates with a third‑party exchange rate provider (e.g., [ExchangeRate-API](https://www.exchangerate-api.com/), [CurrencyAPI](https://currencyapi.com/), or [Fixer.io](https://fixer.io/)) to deliver accurate, up‑to‑date currency data. It is designed to be lightweight, cache‑friendly, and easily extendable.

---

## Features

- ✅ **Latest Exchange Rates** – Get current rates for any base currency (USD, EUR, GBP, etc.)
- ✅ **Currency Conversion** – Convert any amount between two currencies
- ✅ **Historical Rates** – Retrieve rates for a specific past date
- ✅ **Multi‑currency Support** – Works with 150+ world currencies
- ✅ **Caching** – Reduces external API calls and improves response times
- ✅ **Error Handling** – Graceful fallbacks and meaningful error messages
- ✅ **Swagger / OpenAPI** – Interactive API documentation (if applicable)
- ✅ **Environment‑based Configuration** – API keys and settings via `.env` or `appsettings.json`

---

## Technologies Used

| Component          | Technology                                   |
|--------------------|----------------------------------------------|
| Language           | **[C# / TypeScript / Python]**               |
| Framework          | **[ASP.NET Core / Express.js / FastAPI]**    |
| HTTP Client        | **[HttpClient / Axios / requests]**          |
| Caching            | **[IMemoryCache / Redis / node-cache]**      |
| Documentation      | **[Swagger / Postman / OpenAPI]**            |
| Testing            | **[xUnit / Jest / pytest]**                  |

---

## Getting Started

### Prerequisites

- **[.NET 8 SDK](https://dotnet.microsoft.com/download) / [Node.js 18+] / [Python 3.10+]**
- An API key from your chosen exchange rate provider:
  - [ExchangeRate-API](https://www.exchangerate-api.com/) (free tier available)
  - [CurrencyAPI](https://currencyapi.com/) (free tier available)
  - [Fixer.io](https://fixer.io/) (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/evangelosvlachos96-dotcom/currency-exchange.git
   cd currency-exchange

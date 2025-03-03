---
title: Tradinsight Automated Crypto Trading Agent
---

> 👬 **Team**: Hyun Kang
> 👨🏻‍💻 **Role**: Solo Project 
> 📅 **Date**: Jan 2025 - Feb 2025

## TL;DR
Automated crypto trading agent that uses technical analysis and sentiment analysis to make trading decisions. Currently running on Binance and a status can be viewed on [this page](https://tradinsight.vercel.app/).

## Introduction

In today's fast-paced cryptocurrency markets, traders are constantly seeking an edge through better analysis, automation, and decision-making tools. TradInsight is an open-source framework that combines technical analysis, sentiment analysis, and AI-powered portfolio management to provide comprehensive cryptocurrency trading insights and automation.

This article explores the architecture and capabilities of TradInsight, demonstrating how it can help traders make more informed decisions in the volatile world of cryptocurrency trading.

## Architecture Overview

TradInsight is built around three core components:

1. **Technical Analysis**: Processes market data and indicators to identify trends and patterns
2. **Sentiment Analysis**: Evaluates news, social media, and market sentiment
3. **Portfolio Management**: Uses LLMs (Large Language Models) to provide trading recommendations

The system works by collecting data, performing analysis, and then executing trades based on sophisticated AI-driven insights. Let's explore each component in detail.

## Technical Analysis Capabilities

The technical analysis module processes market data from cryptocurrency exchanges (primarily Binance) and calculates various indicators to identify market trends and potential entry/exit points.

Key features include:

- **OHLCV Data Processing**: Retrieves and processes Open, High, Low, Close, Volume data with customizable timeframes
- **Multiple Technical Indicators**: Supports EMA, RSI, MACD, Bollinger Bands and more through the TALib integration
- **Derivative Market Data**: Analyzes open interest, funding rates, liquidations, and long/short ratios
- **Bitcoin Dominance Analysis**: Tracks Bitcoin dominance as a market sentiment indicator

```python
def technical_analysis(target: str, config: dict) -> TechnicalAnalysis:
    """
    Perform technical analysis on the target cryptocurrency
    """
    ohlcv = get_ohlcv(target, config['data']['interval'], config['data']['lookback'])
    indicators = get_indicators(ohlcv, **config['indicators'])
    bitcoin_dominance = get_bitcoin_dominance(config['bitcoin_dominance']['days'])
    derivative = get_derivative_data(target, config['derivative'])
    
    # Process data and generate insights with LLM...
```

## Sentiment Analysis Engine

The sentiment analysis component evaluates market sentiment by gathering data from various sources:

- **News Sentiment**: Collects and analyzes cryptocurrency news articles
- **Fear and Greed Index**: Tracks market sentiment indicators
- **Google Trends**: Analyzes search interest in cryptocurrencies
- **AI-Powered Evaluation**: Processes raw data through LLMs to generate human-readable insights

```python
def sentimental_analysis(target: str, config: dict) -> SentimentalAnalysis:
    """
    Analyze sentiment for the target cryptocurrency
    """
    news_sentiment = get_news_sentiment(target)
    fear_and_greed_index = fetch_fear_and_greed_index()
    
    # Process sentiment data with LLM...
```

## AI-Powered Portfolio Management

What sets TradInsight apart is its AI-powered portfolio management system. The framework leverages advanced language models to process complex technical and sentiment data, then generate actionable trading recommendations:

- **Portfolio Analysis**: Evaluates current holdings and market conditions
- **Risk Management**: Considers stop-loss and take-profit levels for each position
- **Trade Generation**: Creates structured order recommendations (buy, sell, hold)
- **Execution Automation**: Can automatically execute trades on connected exchanges

The system uses a carefully designed prompt structure to guide the language model toward producing consistent, well-reasoned trading decisions:

```python
messages = [
    SystemMessage(content=portfolio_management_system_prompt),
    HumanMessage(content=user_prompt)
]

response = model.invoke(messages)
formatter = formatter.with_structured_output(OrderBook)
formatted_response = formatter.invoke(response.content)
orders = formatted_response.orders
```

## Automated Execution

TradInsight can automatically execute trading decisions through its integration with cryptocurrency exchanges:

- **Market Orders**: For immediate execution
- **OTOCO Orders**: One-Triggers-OCO (One-Cancels-Other) for automated risk management
- **Portfolio Tracking**: Maintains real-time portfolio state
- **Order Management**: Clears incomplete orders and tracks execution status

## Database Integration

The framework integrates with Supabase for persistent storage of:

- **Analysis Reports**: Stores technical and sentiment analysis for review
- **Portfolio Tracking**: Maintains portfolio history over time
- **Trading Decisions**: Records all trading decisions and their rationale

This creates a valuable history for back-testing and strategy refinement.

## Customization and Extensibility

TradInsight is designed to be highly customizable:

- **Model Selection**: Supports multiple LLM providers (OpenAI, Google's Gemini, DeepSeek)
- **Indicator Configuration**: Customizable technical indicators and timeframes
- **Prompting System**: Adjustable prompts for the AI decision-making process
- **Schedule Management**: Configurable execution schedule for different strategies

## Implementation Example

Here's a simplified example of how TradInsight operates:

1. **Data Collection**: Gathers technical indicators and sentiment data for target cryptocurrencies
2. **Analysis Generation**: Processes data through specialized LLMs to generate insights
3. **Decision Making**: Combines analyses to make trading recommendations
4. **Order Execution**: Automatically executes trades based on AI recommendations
5. **Record Keeping**: Stores all analyses and decisions for future reference

## Conclusion

TradInsight represents a sophisticated approach to cryptocurrency trading that combines traditional technical analysis with cutting-edge AI capabilities. By leveraging the power of large language models and integrating diverse data sources, it provides traders with comprehensive insights and automation capabilities.

Whether you're a seasoned trader looking to automate your strategy or a developer interested in AI applications in finance, TradInsight offers a flexible framework that can be customized to various trading approaches and risk profiles.

The project is continuously evolving, with opportunities to extend its capabilities through additional data sources, improved AI models, and enhanced trading strategies.

---

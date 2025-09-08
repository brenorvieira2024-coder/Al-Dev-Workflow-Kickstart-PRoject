from typing import Any, Dict
import google.generativeai as genai

from .config import Config


def ask_gemini(prompt: str) -> str:
	"""Send a prompt to Gemini and return the response text.

	If the API key is not configured, a helpful message is returned instead.
	"""
	if not Config.GEMINI_API_KEY:
		return "Gemini API key não configurada. Defina GEMINI_API_KEY no .env."

	genai.configure(api_key=Config.GEMINI_API_KEY)
	model = genai.GenerativeModel(Config.GEMINI_MODEL)
	response = model.generate_content(prompt)
	try:
		return response.text  # type: ignore[attr-defined]
	except Exception:
		return str(response)
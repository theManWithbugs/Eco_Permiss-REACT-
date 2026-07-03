import logging

from django.core.exceptions import ValidationError
from core.tasks import send_email

logger = logging.getLogger(__name__)

def check_number(phone):
  DDD = str(f"({phone[:2]})")
  number = str(phone[2:])

  result = str(DDD + number)
  print(result)

def validador_cpf(cpf):
    numeros = [int(digito) for digito in cpf if digito.isdigit()]

    if len(numeros) != 11:
        raise ValidationError("CPF inválido.")

    soma1 = sum(a * b for a, b in zip(numeros[0:9], range(10, 1, -1)))
    digito1 = (soma1 * 10 % 11) % 10

    if numeros[9] != digito1:
        raise ValidationError("CPF inválido.")

    soma2 = sum(a * b for a, b in zip(numeros[0:10], range(11, 1, -1)))
    digito2 = (soma2 * 10 % 11) % 10

    if numeros[10] != digito2:
        raise ValidationError("CPF inválido.")

def enviar_username(email, username):
    mensagem_html = f"""
    <html>
    <body style="font-family: Arial, sans-serif; color:#333;">
        <h2 style="color:#2e7d32;">Cadastro realizado com sucesso!</h2>
        <p>Olá, <strong>{username}</strong>.</p>
        <p>Seu cadastro foi realizado com sucesso no sistema.</p>
        <p>Seu nome de usuário é: <strong>{username}</strong>.</p>
    </body>
    </html>
    """

    mensagem_texto = f"""
    Cadastro realizado com sucesso!

    Olá, {username}.

    Seu cadastro foi realizado com sucesso no sistema.
    Seu nome de usuário é: {username}.
    """

    subject = "Cadastro realizado com sucesso"

    try:
        send_email.delay(email, mensagem_texto, mensagem_html, subject)
    except Exception as exc:
        logger.exception("Falha ao enfileirar o e-mail de cadastro. %s", exc)

def recup_creden(email, username, password):
    mensagem_html = f"""
    <html>
    <body style="font-family: Arial, sans-serif; color:#333;">
        <h2 style="color:#2e7d32;">Seus dados de acesso</h2>
        <p>Olá, <strong>{username}</strong>.</p>
        <p>Segue abaixo seus dados de acesso ao sistema:</p>
        <p><strong>Usuário:</strong> {username}</p>
        <p><strong>Senha:</strong> {password}</p>
    </body>
    </html>
    """

    mensagem_texto = f"""
    Seus dados de acesso

    Olá, {username}.

    Segue abaixo seus dados de acesso ao sistema:
    Usuário: {username}
    Senha: {password}
    """

    subject = "Seus dados de acesso"

    try:
        send_email.delay(email, mensagem_texto, mensagem_html, subject)
    except Exception as exc:
        logger.exception("Falha ao enfileirar o e-mail de cadastro. %s", exc)

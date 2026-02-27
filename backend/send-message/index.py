import os
import json
import urllib.request
import urllib.error
from datetime import datetime


def handler(event: dict, context) -> dict:
    """Принимает сообщение с сайта и отправляет его в Telegram."""

    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': cors_headers,
            'body': '',
        }

    try:
        body = json.loads(event.get('body') or '{}')
    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'headers': cors_headers,
            'body': json.dumps({'ok': False, 'error': 'Invalid JSON'}),
        }

    name    = body.get('name', '').strip()
    phone   = body.get('phone', '').strip()
    message = body.get('message', '').strip()
    subject = body.get('subject', '').strip()   # опциональная тема

    if not name and not phone and not message:
        return {
            'statusCode': 400,
            'headers': cors_headers,
            'body': json.dumps({'ok': False, 'error': 'Empty request'}),
        }

    # --- формируем текст сообщения ---
    now = datetime.utcnow().strftime('%d.%m.%Y %H:%M UTC')
    lines = ['📬 *Новое сообщение с сайта*\n']

    if name:
        lines.append(f'👤 *Имя:* {name}')
    if phone:
        lines.append(f'📞 *Телефон:* {phone}')
    if subject:
        lines.append(f'📌 *Тема:* {subject}')
    if message:
        lines.append(f'\n💬 *Сообщение:*\n{message}')

    lines.append(f'\n🕐 _{now}_')
    lines.append('_Отправлено с сайта_')

    text = '\n'.join(lines)

    # --- отправляем в Telegram ---
    token   = os.environ.get('TELEGRAM_BOT_TOKEN', '')
    chat_id = os.environ.get('TELEGRAM_CHAT_ID', '')

    if not token or not chat_id:
        return {
            'statusCode': 500,
            'headers': cors_headers,
            'body': json.dumps({'ok': False, 'error': 'Bot not configured'}),
        }

    tg_url  = f'https://api.telegram.org/bot{token}/sendMessage'
    payload = json.dumps({
        'chat_id':    chat_id,
        'text':       text,
        'parse_mode': 'Markdown',
    }).encode('utf-8')

    try:
        req = urllib.request.Request(
            tg_url,
            data=payload,
            headers={'Content-Type': 'application/json'},
            method='POST',
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            result = json.loads(resp.read())
        ok = result.get('ok', False)
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8', errors='replace')
        return {
            'statusCode': 502,
            'headers': cors_headers,
            'body': json.dumps({'ok': False, 'error': f'Telegram error: {error_body}'}),
        }
    except Exception as exc:
        return {
            'statusCode': 502,
            'headers': cors_headers,
            'body': json.dumps({'ok': False, 'error': str(exc)}),
        }

    return {
        'statusCode': 200 if ok else 502,
        'headers': cors_headers,
        'body': json.dumps({'ok': ok}),
    }

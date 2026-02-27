import os
import json
import urllib.request

def handler(event: dict, context) -> dict:
    """Отправляет конфигурацию сборки ПК в Telegram."""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }

    body = json.loads(event.get('body') or '{}')
    config = body.get('config', {})
    total = body.get('total', 0)
    name = body.get('name', '').strip()
    phone = body.get('phone', '').strip()

    lines = ['🖥 *Новая заявка на сборку ПК*\n']

    if name:
        lines.append(f'👤 *Имя:* {name}')
    if phone:
        lines.append(f'📞 *Телефон:* {phone}')

    if name or phone:
        lines.append('')

    labels = {
        'socket': 'Платформа',
        'cpu': 'Процессор',
        'mb': 'Материнская плата',
        'gpu': 'Видеокарта',
        'ram': 'Оперативная память',
        'storage': 'Накопитель',
        'psu': 'Блок питания',
        'заявка': 'Сообщение',
    }

    for key, label in labels.items():
        val = config.get(key)
        if val:
            lines.append(f'• *{label}:* {val}')

    if total > 0:
        lines.append(f'\n💰 *Итого:* {total:,} ₽'.replace(',', ' '))

    lines.append('\n_Отправлено с сайта_')

    text = '\n'.join(lines)

    token = os.environ['TELEGRAM_BOT_TOKEN']
    chat_id = os.environ.get('TELEGRAM_CHAT_ID', 'sborkapcid866328516')

    url = f'https://api.telegram.org/bot{token}/sendMessage'
    payload = json.dumps({
        'chat_id': chat_id,
        'text': text,
        'parse_mode': 'Markdown'
    }).encode('utf-8')

    req = urllib.request.Request(url, data=payload, headers={'Content-Type': 'application/json'}, method='POST')
    with urllib.request.urlopen(req) as resp:
        result = json.loads(resp.read())

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'ok': result.get('ok', False)})
    }
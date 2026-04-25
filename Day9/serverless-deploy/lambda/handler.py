import json
import uuid
import boto3
from datetime import datetime
from botocore.exceptions import ClientError

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('workshop-notes')


def response(status_code, body):
    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        "body": json.dumps(body)
    }


def handler(event, context):
    try:
        method = event["requestContext"]["http"]["method"]
        path = event["rawPath"]
        path_params = event.get("pathParameters") or {}

        if method == "POST" and path == "/notes":
            return create_note(event)

        elif method == "GET" and path == "/notes":
            return list_notes()

        elif method == "GET" and "id" in path_params:
            return get_note(path_params["id"])

        elif method == "PUT" and "id" in path_params:
            return update_note(path_params["id"], event)

        elif method == "DELETE" and "id" in path_params:
            return delete_note(path_params["id"])

        else:
            return response(404, {"message": "Route not found"})

    except Exception as e:
        return response(500, {"error": str(e)})


# ------------------ CRUD FUNCTIONS ------------------

def create_note(event):
    body = json.loads(event.get("body") or "{}")

    title = body.get("title")
    content = body.get("content", "")

    if not title or title.strip() == "":
        return response(400, {"error": "Title is required"})

    note_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat()

    item = {
        "id": note_id,
        "title": title,
        "content": content,
        "created_at": now,
        "updated_at": now
    }

    table.put_item(Item=item)

    return response(201, item)


def list_notes():
    result = table.scan()
    items = result.get("Items", [])

    return response(200, items)


def get_note(note_id):
    result = table.get_item(Key={"id": note_id})
    item = result.get("Item")

    if not item:
        return response(404, {"error": "Note not found"})

    return response(200, item)


def update_note(note_id, event):
    body = json.loads(event.get("body") or "{}")

    title = body.get("title")
    content = body.get("content")

    if not title or title.strip() == "":
        return response(400, {"error": "Title is required"})

    now = datetime.utcnow().isoformat()

    try:
        result = table.update_item(
            Key={"id": note_id},
            UpdateExpression="SET title = :t, content = :c, updated_at = :u",
            ExpressionAttributeValues={
                ":t": title,
                ":c": content,
                ":u": now
            },
            ConditionExpression="attribute_exists(id)",
            ReturnValues="ALL_NEW"
        )

        return response(200, result["Attributes"])

    except ClientError as e:
        if e.response["Error"]["Code"] == "ConditionalCheckFailedException":
            return response(404, {"error": "Note not found"})
        else:
            raise e


def delete_note(note_id):
    try:
        table.delete_item(
            Key={"id": note_id},
            ConditionExpression="attribute_exists(id)"
        )
        return response(204, {})

    except ClientError as e:
        if e.response["Error"]["Code"] == "ConditionalCheckFailedException":
            return response(404, {"error": "Note not found"})
        else:
            raise e
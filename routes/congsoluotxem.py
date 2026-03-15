from flask import Blueprint, request
from extensions import db
from sqlalchemy import text

congsoluotxem_bp = Blueprint("congsoluotxem_bp", __name__)

@congsoluotxem_bp.route("/congsoluotxem", methods=["POST"])
def congsoluotxem():
    """
    Cộng số lượt xem cho account
    ---
    tags:
        - Acc
    parameters:
        - name: body
            in: body
            required: true
            schema:
                type: object
                properties:
                    ma_acc:
                        type: integer
                        example: 5
    responses:
        200:
            description: Cộng lượt xem thành công
    """

    data = request.get_json()
    ma_acc = data.get("ma_acc")

    sql = """
        UPDATE Acc
        SET so_luot_xem = so_luot_xem + 1
        WHERE ma_acc = :ma_acc
    """

    db.session.execute(text(sql), {"ma_acc": ma_acc})
    db.session.commit()

    return {"status": "success"}
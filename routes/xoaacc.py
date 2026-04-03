from flask import Blueprint, request
from extensions import db
from sqlalchemy import text
from routes.auth_decorator import admin_required

xoaacc_bp = Blueprint("xoaacc_bp",__name__)

@xoaacc_bp.route("/xoaacc",methods = ["POST"])
@admin_required
def xoaacc():
    """
    Xóa account theo mã acc
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
        description: Xóa acc thành công
        schema:
          type: object
          properties:
            status:
              type: string
              example: success
    """

    data = request.get_json()

    sql = """
        DELETE FROM Acc
        WHERE ma_acc = :ma_acc
    """

    db.session.execute(text(sql), {"ma_acc": data.get("ma_acc")})
    db.session.commit()

    return {"status": "success"}
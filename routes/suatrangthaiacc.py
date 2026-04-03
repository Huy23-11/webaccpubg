from flask import Blueprint, request
from sqlalchemy import text
from extensions import db
from routes.auth_decorator import admin_required

suatrangthaiacc_bp = Blueprint("suatrangthaiacc_bp",__name__)

@suatrangthaiacc_bp.route("/suatrangthaiacc",methods=["POST"])
@admin_required
def suatrangthaiacc():
    """
    Đổi trạng thái account (ACTIVE ↔ SOLD)
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
            trang_thai:
              type: string
              example: ACTIVE
    responses:
      200:
        description: Cập nhật trạng thái acc thành công
        schema:
          type: object
          properties:
            status:
              type: string
              example: success
    """

    data = request.get_json()
    ma = data.get("ma_acc")
    trangthai1 = data.get("trang_thai")

    if trangthai1 == 'SOLD':
        trangthai2 = 'ACTIVE'
    elif trangthai1 == 'ACTIVE':
        trangthai2 = 'SOLD'

    sql = """
        UPDATE Acc
        SET trang_thai = :trangthai
        WHERE ma_acc = :ma
    """

    db.session.execute(text(sql), {"trangthai": trangthai2, "ma": ma})
    db.session.commit()

    return {"status": "success"}
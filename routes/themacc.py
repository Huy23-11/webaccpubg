from flask import Blueprint, request
from sqlalchemy import text
from extensions import db

themacc_bp = Blueprint("themacc_bp",__name__)

@themacc_bp.route("/themacc", methods = ["POST"])
def themacc():
    """
    Thêm account mới
    ---
    tags:
      - Acc
    responses:
      200:
        description: Thêm acc thành công
        schema:
          type: object
          properties:
            status:
              type: string
              example: success
    """

    sql = """
        INSERT INTO Acc(gia, ngay_dang, trang_thai)
        VALUES (0, CAST(GETDATE() AS DATE), 'SOLD')
    """

    db.session.execute(text(sql))
    db.session.commit()

    return {"status": "success"}
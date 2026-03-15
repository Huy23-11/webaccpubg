from flask import Blueprint, request
from sqlalchemy import text
from extensions import db
from decimal import Decimal
from routes.dsnguoimua import dsnguoimua
from routes.doanhthu import emit_update_doanhthutheonam, emit_update_doanhthutheotuan

suanguoimua_bp = Blueprint("suanguoimua_bp",__name__)

@suanguoimua_bp.route("/popupsodunguoimua", methods=["POST"])
def popupsodunguoimua():
    """
    Lấy thông tin người mua (tên + số dư)
    ---
    tags:
      - NguoiMua
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            ma_nguoi_mua:
              type: integer
              example: 3
    responses:
      200:
        description: Trả thông tin người mua
        schema:
          type: object
          properties:
            status:
              type: string
              example: success
            ten:
              type: string
              example: Nguyen Van A
            so_du:
              type: number
              example: 500000
    """

    data = request.get_json()
    ma = data.get("ma_nguoi_mua")

    sql = """
        SELECT ten, so_du
        FROM NguoiMua
        WHERE ma_nguoi_mua = :ma
    """

    result = db.session.execute(text(sql), {"ma":ma}).fetchone()

    return {
        "status":"success",
        "ten": result.ten,
        "so_du": result.so_du
    }


@suanguoimua_bp.route("/suasodu", methods=["POST"])
def suasodu():
    """
    Sửa số dư người mua
    ---
    tags:
      - NguoiMua
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            ma_nguoi_mua:
              type: integer
              example: 3
            so_du_moi:
              type: number
              example: 1000000
    responses:
      200:
        description: Cập nhật số dư thành công
        schema:
          type: object
          properties:
            status:
              type: string
              example: success
    """

    data = request.get_json()
    ma = data.get("ma_nguoi_mua")
    sodu_moi = Decimal(data.get("so_du_moi"))

    sql = """
        SELECT so_du
        FROM NguoiMua
        WHERE ma_nguoi_mua = :ma
    """

    sodu_cu = db.session.execute(text(sql), {"ma":ma}).scalar()

    chenhlech = sodu_moi - sodu_cu

    if chenhlech > 0:

        sql_don = """
            SELECT TOP 1 ma_don
            FROM DonNapTien
            WHERE ma_nguoi_mua = :ma
            AND trang_thai <> 'SUCCESS'
            ORDER BY thoi_diem DESC
        """

        don = db.session.execute(text(sql_don), {"ma":ma}).fetchone()

        if don:
            sql_update_don = """
                UPDATE DonNapTien
                SET so_tien = :tien, trang_thai = 'SUCCESS'
                WHERE ma_don = :madon
            """
            db.session.execute(text(sql_update_don), {
                "tien": chenhlech,
                "madon": don.ma_don
            })

        else:
            sql_insert_don = """
                INSERT INTO DonNapTien (ma_nguoi_mua, so_tien, trang_thai)
                VALUES (:ma, :tien, 'SUCCESS')
            """

            db.session.execute(text(sql_insert_don), {
                "ma": ma,
                "tien": chenhlech
            })
        emit_update_doanhthutheonam()
        emit_update_doanhthutheotuan()

    sql_update = """
        UPDATE NguoiMua
        SET so_du = :sodu
        WHERE ma_nguoi_mua = :ma
    """

    db.session.execute(text(sql_update), {
        "sodu": sodu_moi,
        "ma": ma
    })
    db.session.commit()
    dsnguoimua()
    return {"status":"success"}
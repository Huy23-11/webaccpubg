from flask import Blueprint, request
from sqlalchemy import text
from extensions import db
from decimal import Decimal
from routes.dsnguoimua import dsnguoimua
from routes.doanhthu import emit_update_doanhthutheonam, emit_update_doanhthutheotuan
from routes.auth_decorator import admin_required
from routes.setvip import setvip
import uuid

suanguoimua_bp = Blueprint("suanguoimua_bp",__name__)

@suanguoimua_bp.route("/popupsodunguoimua", methods=["POST"])
@admin_required
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
@admin_required
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
    ten_moi = data.get("ten_moi")
    tk_moi = data.get("tai_khoan_moi")
    mk_moi = data.get("mat_khau_moi")
    sodu_moi = Decimal(data.get("so_du_moi"))

    sql = """
        SELECT so_du
        FROM NguoiMua
        WHERE ma_nguoi_mua = :ma
    """

    sodu_cu = db.session.execute(text(sql), {"ma":ma}).scalar()

    chenhlech = sodu_moi - sodu_cu

    if chenhlech > 0:
        transaction_id = str(uuid.uuid4())
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
        sql_insert_gd = """
            INSERT INTO GiaoDich (
                ma_giao_dich,
                ma_nguoi_mua,
                ma_acc,
                so_du_truoc,
                so_tien,
                so_du_sau,
                noi_dung,
                loai
            )
            VALUES (
                :ma_gd,
                :ma_nguoi_mua,
                NULL,
                :truoc,
                :so_tien,
                :sau,
                :noi_dung,
                'NAP'
            )
        """

        db.session.execute(text(sql_insert_gd), {
            "ma_gd": transaction_id,
            "ma_nguoi_mua": ma,
            "truoc": sodu_cu,
            "so_tien": chenhlech,
            "sau": sodu_moi,
            "noi_dung": "Số dư được cộng vào tài khoản"
        })
        setvip()
        emit_update_doanhthutheonam()
        emit_update_doanhthutheotuan()

    sql_update = """
        UPDATE NguoiMua
        SET ten = :ten, tai_khoan = :tk, mat_khau = :mk, so_du = :sodu
        WHERE ma_nguoi_mua = :ma
    """

    db.session.execute(text(sql_update), {
        "ten": ten_moi,
        "tk": tk_moi,
        "mk": mk_moi,
        "sodu": sodu_moi,
        "ma": ma
    })
    db.session.commit()
    dsnguoimua()
    return {"status":"success"}

@suanguoimua_bp.route("/suavip", methods=["POST"])
@admin_required
def suavip():
    data = request.get_json()
    ma = int(data.get("manguoi"))
    vip = int(data.get("vip"))
    sql1 = """
      update NguoiMua 
      set vip = 1
      where ma_nguoi_mua = :ma
    """

    sql2 = """
      update NguoiMua 
      set vip = 0
      where ma_nguoi_mua = :ma
    """
    if vip == 0:
        db.session.execute(text(sql1),{"ma": ma})
    elif vip == 1:
        db.session.execute(text(sql2),{"ma": ma})
    db.session.commit()
    return {"status":"success"}
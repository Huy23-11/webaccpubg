from flask import Blueprint, request, jsonify
from extensions import db
from sqlalchemy import text

xoanguoimua_bp = Blueprint("xoanguoimua_bp",__name__)

@xoanguoimua_bp.route("/xoanguoimua", methods = ["POST"])
def xoanguoimua():
    data = request.get_json()
    ma = data.get("ma_nguoi_mua")
    # sql = """
    #     DELETE FROM NguoiMua WHERE ma_nguoi_mua = :ma"""
    # db.session.execute(text(sql), {"ma": ma})
    # db.session.commit()
    # print(ma)
    return jsonify({"status": "success"})


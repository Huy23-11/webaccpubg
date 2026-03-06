from flask import Blueprint, jsonify,request
from extensions import db
from sqlalchemy import text

xoaanhacc_bp = Blueprint("xoaanhacc_bp",__name__)
@xoaanhacc_bp.route("/xoaanhacc",methods=["POST"])
def xoaanhacc():
    data=request.get_json()
    ma_anh=data.get("ma_anh")
    sql_delete=text("DELETE FROM AnhAcc WHERE ma_anh= :ma_anh")
    db.session.execute(sql_delete,{"ma_anh": ma_anh})
    db.session.commit()
    return jsonify({"status":"success"})
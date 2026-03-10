from flask import Blueprint,session

dangxuat_bp = Blueprint("dangxuat_bp", __name__)

@dangxuat_bp.route("/dangxuat")
def dangxuat():
    session.clear()
    return {"status":"success"}
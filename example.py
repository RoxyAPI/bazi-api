"""
BaZi API: the Four Pillars of Destiny for one birth moment. Four pillars of stem
over branch, the hidden stems inside each branch, the Ten Gods measured from the
Day Master, the Na Yin sound element, the five element balance, and the clashes
and combinations between the pillars.

The comparison at the end is the reason this endpoint types its conventions. A
birth at 23:30 falls in the zi hour, where three living schools disagree about
which sexagenary day it belongs to. Ask for each in turn and the chart moves.
"""

import os

from roxy_sdk import create_roxy

roxy = create_roxy(os.environ["ROXY_API_KEY"])

BIRTH = {
    "date": "1990-06-15",
    "time": "23:30:00",
    "timezone": "Asia/Shanghai",
}

DAY_BOUNDARIES = ["split-zi", "midnight", "early-zi"]


def chart(day_boundary):
    return roxy.chinese_astrology.generate_bazi_chart(**BIRTH, day_boundary=day_boundary)


def main():
    bazi = chart("split-zi")

    offset = bazi["birthData"]["timezone"]
    print(f"Birth: {bazi['birthData']['date']} {bazi['birthData']['time']} at UTC{offset:+g}")
    conventions = "  ".join(f"{k}={v}" for k, v in bazi["conventions"].items())
    print(f"Conventions applied: {conventions}")
    dm = bazi["dayMaster"]
    print(f"Day Master: {dm['stem']} ({dm['polarity']} {dm['element']}), year animal {bazi['zodiacAnimal']}")

    print("\nFour Pillars")
    print(f"  {'position':<9}{'pillar':<10}{'ten god':<19}{'hidden stems':<22}na yin")
    for p in bazi["pillars"]:
        hidden = " ".join(f"{h['stem']['id']}({h['role'][0]})" for h in p["hiddenStems"])
        print(f"  {p['position']:<9}{p['id']:<10}{p['tenGod']['name']:<19}{hidden:<22}{p['naYin']}")

    print("\nFive element balance")
    for e in bazi["fiveElements"]:
        print(f"  {e['element']:<7}{e['count']:<3}{e['level']}")

    print(f"\nInteractions between the pillars: {len(bazi['interactions'])}")
    for i in bazi["interactions"]:
        members = " + ".join(i["members"])
        positions = " / ".join(i["positions"])
        print(f"  {i['type']:<12}{members:<12}{positions:<16}{i['quality']}")

    print(f"\n{bazi['summary']}")

    print("\nSame birth, three day boundary schools")
    print(f"  {'dayBoundary':<14}{'year':<10}{'month':<10}{'day':<10}{'hour':<10}day master")
    for boundary in DAY_BOUNDARIES:
        c = chart(boundary)
        ids = [p["id"] for p in c["pillars"]]
        cdm = c["dayMaster"]
        label = f"{cdm['stem']} ({cdm['polarity']} {cdm['element']})"
        print(f"  {c['conventions']['dayBoundary']:<14}{ids[0]:<10}{ids[1]:<10}{ids[2]:<10}{ids[3]:<10}{label}")

    print("\n  Every response carries the conventions it was computed under, so a stored")
    print("  chart can be reproduced exactly rather than guessed at.")


if __name__ == "__main__":
    main()

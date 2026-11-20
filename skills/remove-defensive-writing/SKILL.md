---
name: remove-defensive-writing
description: >
  Use when tightening, rewriting, or reviewing prose a human reads: product
  docs, install and upgrade guides, changelogs, and UI copy. Use it especially
  when that prose hedges after the fact, reads like an experiment log, or
  whose title and sidebar name a different scope than the page. Do not thin
  out instructions written for an agent. Keep a limit that changes what the
  reader may do or infer. Ask a human before an edit that conflicts with
  project conventions or with a limit already on the page. Do not rewrite copy
  that has no clear problem. Triggers include 不是而是, 不能证明, 不代表,
  不等于, 并不意味着, 需另行测试, 需独立核验, 需结合, 待确认, 测试结论,
  采集日期, TODO 过细, and /remove-defensive-writing.
---

# Remove defensive writing

Write the fact this human reader needs for this page. Then stop.

Use this pass when the page is for a person: a guide, a release note, a product page, or interface copy. Use it especially there. An instruction written for an agent keeps its steps, conditions, and checks.

The reader is the person who opens the page to compare, look up, or decide. A sentence stays when it changes that use. A sentence goes when it only blocks an inference the page never made, and the cut leaves the necessary limit in place.

Use this pass for the level of detail, the tone appropriate to the page, and hedges that repeat a limit already stated. General copyediting and typography are separate passes. When a cut, retitle, or change in detail would conflict with a repository rule or with a limit the page already states, name the conflict and ask the human before editing. Leave text that has no clear problem.

## Write the fact

State what was measured, configured, or decided.

Keep a negative when it is the fact or the limit: a switch is off, a baseline does not load a component, a mode was not in this run, a reported number is not the physical allocation. "不使用 HAMi 或 MPS", "未启用静态 SM 分区", and "物理分配需独立核验" are facts.

Delete only the extra sentence that withdraws a conclusion nobody stated and does not change what the reader may do. Words such as 不能证明, 不足以说明, 不代表, 不等于, 并不意味着, 并非, 不能据此, 需另行测试, 需独立核验, 需结合, 待确认 often mark that extra sentence. The same words also mark a real limit. Keep the limit. Replacing one empty hedge with another from the same family does not fix it.

Before:

> 两个客户端各报告 54 个 SM。这里记录的是 API 返回值，物理分配需独立核验。这不能证明物理卡已按此切分，此结论待确认，需另行测试。

After:

> 两个客户端各报告 54 个 SM。记录的是 API 返回值，物理分配需独立核验。

## Match the page

Apply this section to a comparison or results page. Installation steps, upgrade notes, changelog history, and agent instructions keep the procedures, dates, and status labels their own rules require. If those rules and this section disagree, ask the human.

A results page reports numbers and the conditions attached to those numbers. When project conventions allow, use a results heading in the page's language, such as `Results` or `结果`. Keep the heading focused on the results and preserve any verdict the source actually states.

A TODO on that page names the direction: what comparison, under what sameness, for what decision. It does not list every missing model, quota, fault type, or statistic. Three directions beat seven procedures. Name the workload at the level the user stated. A GPU sharing product's typical workload is a workload, not whichever application this one test happened to run.

A sidebar label and a page title name the same scope. The sidebar may be shorter when the parent section already supplies the product name, or when the project uses a short label. A shorter label that drops a topic the page actually covers is the wrong label. If the project convention is a short label, ask before expanding it.

Dates, machine logs, and "公开记录显示" stay out of a comparison page whose reader is choosing among schemes. Keep them on a changelog, a release record, or any page whose date or log is the fact. Keep a condition that changes how two numbers may be compared, and put it on the sentence that cites the numbers.

## Check once

Read the draft and mark any sentence that answers a question the reader did not ask. Cut it only when the cut leaves the necessary limit, number, config, and comparison in place. If the cut would remove one of those, put that piece back as its own short sentence. If the cut conflicts with a repository rule or with a limit the page already states, ask the human before cutting. If nothing is wrong, leave the draft.

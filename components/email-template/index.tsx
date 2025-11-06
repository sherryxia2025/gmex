import { Tailwind } from "@react-email/components";

interface ContactEmailTemplateProps {
  firstName: string;
  email: string;
  contactNumber: string;
  message: string;
}

export function ContactEmailTemplate({
  firstName,
  email,
  contactNumber,
  message,
}: ContactEmailTemplateProps) {
  return (
    <Tailwind>
      <head></head>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8 flex items-center justify-center">
          <div className="max-w-2xl w-full">
            {/* 邮件容器 */}
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              {/* 邮件头部 */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
                <h1 className="text-2xl font-bold text-white">新的联系请求</h1>
                <p className="text-black mt-1 text-sm">您收到了一条新的消息</p>
              </div>

              {/* 邮件内容 */}
              <div className="px-8 py-6">
                {/* 问候语 */}
                <div className="mb-6">
                  <p className="text-gray-700 text-lg">您好，</p>
                  <p className="text-gray-600 mt-2">
                    您收到了来自{" "}
                    <span className="font-semibold text-gray-800">
                      {firstName}
                    </span>{" "}
                    的新消息。
                  </p>
                </div>

                {/* 联系信息卡片 */}
                <div className="bg-slate-50 rounded-lg p-6 mb-6 border border-slate-200">
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    联系信息
                  </h2>

                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="w-24 flex-shrink-0">
                        <span className="text-sm font-medium text-gray-600">
                          姓名：
                        </span>
                      </div>
                      <div className="flex-1">
                        <span className="text-sm text-gray-800">
                          {firstName}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-24 flex-shrink-0">
                        <span className="text-sm font-medium text-gray-600">
                          邮箱：
                        </span>
                      </div>
                      <div className="flex-1">
                        <a
                          href={`mailto:${email}`}
                          className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                        >
                          {email}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-24 flex-shrink-0">
                        <span className="text-sm font-medium text-gray-600">
                          电话：
                        </span>
                      </div>
                      <div className="flex-1">
                        <a
                          href={`tel:${contactNumber}`}
                          className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                        >
                          {contactNumber}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 消息内容 */}
                <div className="mb-6">
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    消息内容
                  </h2>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {message}
                    </p>
                  </div>
                </div>

                {/* 行动按钮 */}
                <div className="flex gap-3">
                  <a
                    href={`mailto:${email}`}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors text-center"
                  >
                    回复邮件
                  </a>
                  <a
                    href={`tel:${contactNumber}`}
                    className="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-lg border-2 border-gray-300 transition-colors text-center"
                  >
                    拨打电话
                  </a>
                </div>
              </div>

              {/* 邮件底部 */}
              <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  此邮件由系统自动发送，请勿直接回复此邮件
                </p>
                <p className="text-xs text-gray-400 text-center mt-1">
                  © 2025 Your Company. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </body>
    </Tailwind>
  );
}

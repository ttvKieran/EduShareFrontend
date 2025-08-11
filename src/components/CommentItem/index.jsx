import React, { useEffect, useState } from 'react';
import API_BASE_URL from '../../configs/system';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import {
  Box,
  Typography,
  Button,
  Chip,
  Avatar,
  Paper,
  TextField,
  Collapse,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  ThumbUp,
  Comment,
  VerifiedUser,
  ExpandMore,
  ExpandLess
} from '@mui/icons-material';

const CommentItem = ({ comment, formatTimeAgo, onReplySubmit, depth = 0 }) => {
  console.log(`Depth: ${depth} Reply: `, comment);
  // console.log(comment.replies);
  if(comment.feedbackId) comment = comment.feedbackId;
  const { authenticatedFetch, currentUser } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [replies, setReplies] = useState([]);

  const maxDepth = 5; // Giới hạn độ sâu tối đa
  const canReply = depth < maxDepth;
  // const replies = comment.replies || [];

  useEffect(() => {
    const fetchComments = async () => {
      console.log(`${API_BASE_URL}/student/feedbacks/replies/${comment?._id}`)
      // if (!replies) {
        try {
          const response = await authenticatedFetch(
            `${API_BASE_URL}/student/feedbacks/replies/${comment?._id}`
          );

          if (!response.ok) {
            throw new Error('Không thể tải bình luận');
          }

          const result = await response.json();
          console.log("HAIZ", result);

          if (result.success) {
            setReplies(result.data);
          } else {
            throw new Error(result.message || 'Lỗi khi tải bình luận');
          }
        } catch (error) {
          console.error('Error fetching comments:', error);
        };
    // }
    }
    fetchComments();
    console.log("This is replies: ",replies);
  }, []);

  const handleReply = async () => {
    if (!replyText.trim()) {
      toast.warning('Vui lòng viết phản hồi');
      return;
    }

    try {
      setSubmitLoading(true);
      // Sử dụng comment gốc (depth 0) làm parent hoặc comment hiện tại nếu đang ở nested
      const parentId = comment?._id;
      console.log(parentId);
      let api = `${API_BASE_URL}/student/feedbacks/${comment?.documentId}`;
      if(parentId) api = `${API_BASE_URL}/student/feedbacks/${comment?.documentId}?parentId=${parentId}`;
      const response = await authenticatedFetch(
        api,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            comment: replyText,
            position: 'Sinh viên'
          })
        }
      );
      console.log(response);
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setReplyText('');
          setShowReplyForm(false);
          setShowReplies(true); // Auto show replies sau khi reply
          setReplies([...replies, result.data]);
          toast.success('Đăng phản hồi thành công!');

          // Callback để refresh toàn bộ comments
          if (onReplySubmit) {
            onReplySubmit();
          }
        }
      } else {
        toast.error('Lỗi khi gửi phản hồi');
      }
    } catch (error) {
      toast.error('Lỗi khi gửi phản hồi');
      console.log(error.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleToggleReplies = async () => {
    if (!replies) {
        try {
          const response = await authenticatedFetch(
            `${API_BASE_URL}/student/feedbacks/replies/${comment?._id}`
          );

          if (!response.ok) {
            throw new Error('Không thể tải bình luận');
          }

          const result = await response.json();

          if (result.success) {
            setReplies(result.data.feedbacks);
          } else {
            throw new Error(result.message || 'Lỗi khi tải bình luận');
          }
        } catch (error) {
          console.error('Error fetching comments:', error);
        };
    }
    setShowReplies(!showReplies);
  };

  // Tính tổng số replies bao gồm nested
  const getTotalRepliesCount = (repliesList) => {
    let count = repliesList.length;
    repliesList.forEach(reply => {
      if (reply.replies && reply.replies.length > 0) {
        count += getTotalRepliesCount(reply.replies);
      }
    });
    return count;
  };

  // Transform reply thành format giống comment để có thể gọi lại CommentItem
  // const transformReplyToComment = (reply) => {
  //   // console.log("This is reply: ", reply);
  //   const feedback = reply.feedbackId;
  //   // console.log("This is feedback: ", reply.feedbackId);
  //   const reviewer = feedback.reviewer;
  //   const x = {
  //     id: reply?._id,
  //     documentId: comment.documentId,
  //     user: {
  //       name: reviewer?.name || 'Unknown User',
  //       avatar: reviewer?.name?.charAt(0).toUpperCase() || 'U',
  //       isVerified: reviewer?.role === 'lecturer' || reviewer?.role === 'admin',
  //       year: comment.reviewer?.position || 'Sinh viên'
  //     },
  //     comment: feedback.comment,
  //     createdAt: feedback.createdAt,
  //     replies: feedback.reply?.map(reply => ({
  //       id: reply.feedbackId._id || `reply_${Date.now()}_${Math.random()}`,
  //       comment: reply.feedbackId.comment,
  //       position: reply.feedbackId.position,
  //       reviewerName: reply.feedbackId.reviewerId?.fullName || 'Unknown User',
  //       createdAt: reply.feedbackId.createdAt,
  //       user: {
  //         name: reply.feedbackId.reviewer?.name || 'Unknown User',
  //         avatar: (reply.feedbackId.reviewer?.name || 'U').charAt(0).toUpperCase(),
  //         isVerified: reply.feedbackId.reviewer?.role === 'lecturer' || reply.reviewerId?.role === 'admin',
  //         year: reply.feedbackId.position || 'Sinh viên'
  //       }
  //     })) || [],
  //     parentId: feedback?.id // Để biết reply này thuộc comment nào
  //   };
  //   // console.log("This is return: ", x);
  //   return x;
  // };

  return (
    <Paper
      elevation={depth === 0 ? 1 : 0}
      sx={{
        p: depth === 0 ? 3 : 2,
        bgcolor: depth === 0 ? '#fff' : (depth % 2 === 1 ? '#fafafa' : '#f5f5f5'),
        border: depth === 0 ? '1px solid #e0e0e0' : 'none',
        borderRadius: depth === 0 ? '8px' : '6px',
        borderLeft: depth > 0 ? '3px solid #d32f2f' : 'none',
        ml: depth > 0 ? 2 : 0,
        mt: depth > 0 ? 1 : 0,
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: depth === 0 ? '#d32f2f' : 'transparent',
          boxShadow: depth === 0 ? '0 2px 8px rgba(211, 47, 47, 0.1)' : 'none',
          bgcolor: depth === 0 ? '#fff' : (depth % 2 === 1 ? '#f5f5f5' : '#f0f0f0')
        }
      }}
    >
      {/* Comment Content */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
        <Avatar
          sx={{
            mr: 2,
            width: Math.max(32, 40 - depth * 2),
            height: Math.max(32, 40 - depth * 2),
            // bgcolor: comment.user.isVerified ? '#d32f2f' : '#666',
            bgcolor: '#d32f2f',
            fontSize: `${Math.max(0.8, 1 - depth * 0.05)}rem`,
            fontWeight: 500,
            color: '#fff'
          }}
        >
          {comment?.reviewer?.name?.charAt(0).toUpperCase() || 'U'}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                mr: 1,
                color: '#000',
                fontSize: `${Math.max(0.9, 1.1 - depth * 0.05)}rem`
              }}
            >
              {comment?.reviewer?.name}
            </Typography>
            {comment?.isVerified && (
              <VerifiedUser sx={{
                fontSize: Math.max(14, 16 - depth),
                color: '#d32f2f'
              }} />
            )}
            <Chip
              label={comment?.reviewer?.year || 'Sinh viên'}
              size="small"
              variant="outlined"
              sx={{
                ml: 1,
                height: Math.max(18, 20 - depth),
                fontSize: `${Math.max(0.6, 0.7 - depth * 0.02)}rem`,
                borderColor: '#d32f2f',
                color: '#d32f2f'
              }}
            />
          </Box>
          <Typography
            variant="body2"
            sx={{
              fontSize: `${Math.max(0.7, 0.8 - depth * 0.02)}rem`,
              color: '#666',
              mb: 1
            }}
          >
            {formatTimeAgo(comment?.createdAt)}
          </Typography>
        </Box>
      </Box>

      <Typography
        variant="body1"
        sx={{
          mb: 2,
          lineHeight: 1.6,
          color: '#333',
          pl: Math.max(4, 6 - depth * 0.5),
          fontSize: `${Math.max(0.85, 1 - depth * 0.02)}rem`
        }}
      >
        {comment?.comment}
      </Typography>

      {/* Action Buttons */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        pl: Math.max(4, 6 - depth * 0.5),
        pt: 1.5,
        borderTop: depth === 0 ? '1px solid #f0f0f0' : 'none'
      }}>

        {canReply && (
          <Button
            size="small"
            startIcon={<Comment sx={{ fontSize: Math.max(12, 14 - depth) }} />}
            onClick={() => setShowReplyForm(!showReplyForm)}
            sx={{
              color: '#666',
              fontSize: `${Math.max(0.7, 0.8 - depth * 0.02)}rem`,
              minWidth: 'auto',
              mr: 2,
              '&:hover': {
                color: '#d32f2f',
                bgcolor: '#ffebee'
              }
            }}
          >
            Trả lời
          </Button>
        )}

        {/* View Replies Button */}
        {replies && replies?.length > 0 && (
          <Button
            size="small"
            startIcon={showReplies ?
              <ExpandLess sx={{ fontSize: Math.max(12, 14 - depth) }} /> :
              <ExpandMore sx={{ fontSize: Math.max(12, 14 - depth) }} />
            }
            onClick={handleToggleReplies}
            sx={{
              color: '#666',
              fontSize: `${Math.max(0.7, 0.8 - depth * 0.02)}rem`,
              minWidth: 'auto',
              '&:hover': {
                color: '#d32f2f',
                bgcolor: '#ffebee'
              }
            }}
          >
            {showReplies ? `Ẩn phản hồi (${getTotalRepliesCount(replies)})` : `Xem phản hồi (${getTotalRepliesCount(replies)})`}
          </Button>
        )}
      </Box>

      {/* Max Depth Warning */}
      {!canReply && depth >= maxDepth && (
        <Box sx={{ mt: 2, pl: Math.max(4, 6 - depth * 0.5) }}>
          <Typography variant="caption" sx={{ color: '#999', fontStyle: 'italic' }}>
            Đã đạt độ sâu tối đa cho phản hồi
          </Typography>
        </Box>
      )}

      {/* Reply Form */}
      {canReply && (
        <Collapse in={showReplyForm}>
          <Box sx={{ mt: 3, pl: Math.max(4, 6 - depth * 0.5) }}>
            <Box sx={{ display: 'flex' }}>
              <Avatar sx={{
                width: Math.max(28, 32 - depth * 2),
                height: Math.max(28, 32 - depth * 2),
                mr: 2,
                bgcolor: '#d32f2f',
                fontSize: `${Math.max(0.8, 0.9 - depth * 0.05)}rem`
              }}>
                {currentUser?.fullName?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={Math.max(2, 3 - Math.floor(depth / 2))}
                  placeholder="Viết phản hồi của bạn..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  disabled={submitLoading}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      fontSize: `${Math.max(0.8, 0.9 - depth * 0.02)}rem`,
                      '&.Mui-focused fieldset': {
                        borderColor: '#d32f2f'
                      }
                    }
                  }}
                />
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  <Button
                    size="small"
                    onClick={() => setShowReplyForm(false)}
                    disabled={submitLoading}
                    sx={{
                      color: '#666',
                      fontSize: `${Math.max(0.7, 0.8 - depth * 0.02)}rem`,
                      '&:hover': { bgcolor: '#f5f5f5' }
                    }}
                  >
                    Hủy
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={handleReply}
                    disabled={!replyText.trim() || submitLoading}
                    startIcon={submitLoading && <CircularProgress size={Math.max(14, 16 - depth)} />}
                    sx={{
                      bgcolor: '#d32f2f',
                      fontSize: `${Math.max(0.7, 0.8 - depth * 0.02)}rem`,
                      '&:hover': { bgcolor: '#b71c1c' },
                      '&:disabled': { bgcolor: '#ccc' }
                    }}
                  >
                    {submitLoading ? 'Đang gửi...' : 'Gửi phản hồi'}
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Collapse>
      )}

      {/* Nested Comments (Replies) */}
      <Collapse in={showReplies}>
        <Box sx={{ mt: depth === 0 ? 3 : 2 }}>
          {depth === 0 && <Divider sx={{ mb: 3, borderColor: '#e0e0e0' }} />}

          {depth === 0 && (
            <Typography variant="subtitle2" sx={{ mb: 2, color: '#666', fontWeight: 500, pl: 6 }}>
              {getTotalRepliesCount(replies)} phản hồi
            </Typography>
          )}

          {/* Recursive call to CommentItem for each reply */}
          {replies.map((reply, index) => (
            <CommentItem
              key={reply.id || index}
              comment={reply}
              formatTimeAgo={formatTimeAgo}
              onReplySubmit={onReplySubmit}
              depth={depth + 1}
            />
          ))}

          {/* Load More Button for top level only */}
          {depth === 0 && replies.length > 3 && (
            <Box sx={{ textAlign: 'center', mt: 2, pl: 6 }}>
              <Button
                size="small"
                sx={{
                  color: '#d32f2f',
                  fontSize: '0.8rem',
                  '&:hover': { bgcolor: '#ffebee' }
                }}
              >
                Xem thêm phản hồi
              </Button>
            </Box>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
};

export default CommentItem;